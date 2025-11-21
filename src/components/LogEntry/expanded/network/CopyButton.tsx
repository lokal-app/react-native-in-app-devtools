import { memo } from 'react';
import {
  Share as RNShare,
  StyleSheet,
  Text,
  TouchableOpacity,
} from 'react-native';

interface CopyButtonProps {
  label: string;
  data: string;
}

export const CopyButton = memo<CopyButtonProps>(({ label, data }) => {
  const handlePress = async () => {
    try {
      await RNShare.share({
        message: data,
        title: label,
      });
    } catch (error) {
      // Log error to console (avoiding cyclic dependency with BugBubbleDebugger)
      console.error('Error sharing:', error);
    }
  };

  return (
    <TouchableOpacity
      style={styles.button}
      onPress={handlePress}
      activeOpacity={0.7}
    >
      <Text style={styles.label}>{label}</Text>
    </TouchableOpacity>
  );
});

CopyButton.displayName = 'CopyButton';

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    backgroundColor: '#F2F2F7',
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#E5E5EA',
    gap: 4,
  },
  label: {
    fontSize: 12,
    color: '#8E8E93',
    fontWeight: '500',
  },
});
